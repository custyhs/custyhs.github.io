require 'json'
require 'yaml'
require 'nokogiri'
require 'uri'

root = ARGV.fetch(0, '_site')
version = JSON.parse(File.read(File.join(root, 'version.json'))).fetch('version')
raise 'Invalid build version' unless version.match?(/\A\d{10,14}\z/)

['index.html', 'publications/index.html', 'awards/index.html', '404.html'].each do |name|
  document = Nokogiri::HTML(File.read(File.join(root, name)))
  metadata = document.at_css('meta[name="site-build-version"]')
  raise "Version mismatch in #{name}" unless metadata && metadata['content'] == version
  raise "Version endpoint missing in #{name}" unless metadata['data-version-url'].end_with?('/version.json')

  assets = document.css('link[rel="stylesheet"], script[src], img.site-avatar, link[rel="icon"]')
  local_assets = assets.select do |tag|
    URI.parse(tag['href'] || tag['src']).path.match?(%r{/(assets|images)/})
  end
  raise "Unversioned local asset in #{name}" unless local_assets.all? do |tag|
    query = URI.parse(tag['href'] || tag['src']).query.to_s
    URI.decode_www_form(query).include?(['v', version])
  end
  checker = document.css('script').find { |tag| tag.content.include?('function checkForUpdate') }
  raise "Update checker missing in #{name}" unless checker
  share = document.at_css('meta[property="og:image"]')
  raise "Share image missing in #{name}" unless share && share['content'].end_with?('/images/avatar-600.jpg')
  puts "#{name}: matching build version; #{local_assets.length} assets versioned"
end

home = Nokogiri::HTML(File.read(File.join(root, 'index.html')))
avatar = home.at_css('img.site-avatar')
raise 'Avatar missing or unversioned' unless avatar && avatar['src'].include?("v=#{version}")
puts 'Share image and avatar verified.'

raise 'Tests would be published' if Dir.exist?(File.join(root, 'tests'))
raise 'Version endpoint in sitemap' if File.read(File.join(root, 'sitemap.xml')).include?('/version.json')
puts 'Build metadata and asset versions verified.'

pubs = Nokogiri::HTML(File.read(File.join(root, 'publications/index.html')))
entries = pubs.css('li.pub')
raise "Expected 16 publication entries, found #{entries.length}" unless entries.length == 16
raise 'Entry without year' unless entries.all? { |e| e['data-year'].to_s.match?(/\A\d{4}\z/) }
raise 'Entry without a link pill' unless entries.all? { |e| e.at_css('.pub-links a.pill') }
raise 'Year anchors do not match year links' unless pubs.css('.year-anchor').length == pubs.css('.year-jump a').length
puts "publications: #{entries.length} entries with years and links"

contact_nav = home.at_css('.profile-side nav.contact-links')
raise 'Contact links must sit under the portrait' unless contact_nav && contact_nav['aria-label'] == 'Contact and profiles'
raise 'Contact links left in the text column' if home.at_css('.profile-copy .contact-links')
contact = contact_nav.css('a')
contact_labels = contact.map { |a| a.text.strip }
raise "Contact links changed: #{contact_labels.inspect}" unless contact_labels == ['Email', 'Google Scholar', 'GitHub', 'CV']
contact_hrefs = contact.map { |a| a['href'] }
raise "Contact link targets changed: #{contact_hrefs.inspect}" unless contact_hrefs[0].start_with?('mailto:') && contact_hrefs[1].include?('scholar.google.com') && contact_hrefs[2].include?('github.com/') && contact_hrefs[3].end_with?('/files/CV.pdf')
puts "home: news section #{home.at_css('.news-list') ? 'shown' : 'hidden'}"

overview = home.at_css('section.research-overview')
heading = overview && overview.at_css('h2#research-overview')
raise 'Research Overview section missing' unless heading && heading.text.strip == 'Research Overview'
raise 'Old Research Interests heading still present' if home.css('h2').any? { |h| h.text.strip == 'Research Interests' }
directions = overview.css('p').select { |p| p.at_css('strong') }
titles = directions.map { |p| p.at_css('strong').text.strip }
expected_titles = ['Decision-making in LLMs and LLM agents.', 'Heavy-tailed online learning.', 'Risk-sensitive reinforcement learning.']
raise "Research directions out of order: #{titles.inspect}" unless titles == expected_titles
research_links = directions.flat_map { |p| p.css('a').map { |a| a['href'] } }
raise "Expected 8 research links, found #{research_links.length}" unless research_links.length == 8
primary_links = YAML.load_file(File.join(__dir__, '..', '_data', 'publications.yml')).map { |p| p['links'].first['url'] }
unknown = research_links.reject { |u| primary_links.include?(u) }
raise "Research links not matching publication primary links: #{unknown.inspect}" unless unknown.empty?
puts "research overview: #{titles.length} directions, #{research_links.length} links matching publication data"

awards = Nokogiri::HTML(File.read(File.join(root, 'awards/index.html')))
rows = awards.css('li.award')
raise "Expected at least 7 award rows, found #{rows.length}" unless rows.length >= 7
raise 'Award row without year badge, icon, or title' unless rows.all? { |r| r.at_css('.year-badge') && r.at_css('i[aria-hidden]') && r.at_css('h3') }
puts "awards: #{rows.length} rows with year badges"
