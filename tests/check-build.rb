require 'json'
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

raise 'Contact row should have four links' unless home.css('.contact-links a').length == 4
puts "home: news section #{home.at_css('.news-list') ? 'shown' : 'hidden'}"

awards = Nokogiri::HTML(File.read(File.join(root, 'awards/index.html')))
rows = awards.css('li.award')
raise "Expected at least 7 award rows, found #{rows.length}" unless rows.length >= 7
raise 'Award row without year badge, icon, or title' unless rows.all? { |r| r.at_css('.year-badge') && r.at_css('i[aria-hidden]') && r.at_css('h3') }
puts "awards: #{rows.length} rows with year badges"
