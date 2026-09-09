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

  assets = document.css('link[rel="stylesheet"], script[src], img.author__avatar, link[rel="icon"]')
  local_assets = assets.select do |tag|
    URI.parse(tag['href'] || tag['src']).path.match?(%r{/(assets|images)/})
  end
  raise "Unversioned local asset in #{name}" unless local_assets.all? do |tag|
    query = URI.parse(tag['href'] || tag['src']).query.to_s
    URI.decode_www_form(query).include?(['v', version])
  end
  checker = document.css('script').find { |tag| tag.content.include?('function checkForUpdate') }
  raise "Update checker missing in #{name}" unless checker
  puts "#{name}: matching build version; #{local_assets.length} assets versioned"
end

raise 'Tests would be published' if Dir.exist?(File.join(root, 'tests'))
raise 'Version endpoint in sitemap' if File.read(File.join(root, 'sitemap.xml')).include?('/version.json')
puts 'Build metadata and asset versions verified.'
