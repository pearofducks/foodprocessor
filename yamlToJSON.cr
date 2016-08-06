require "yaml"
require "json"
files = Dir.glob(File.join(File.expand_path(ARGV[0]),"*.recipe"))
recipes = files.map do |f|
  begin
    YAML.parse(File.read(f)).as_h
  rescue
    puts "ERROR at #{f}"
  end
end
File.write(File.join(File.expand_path(ARGV[1]),"recipes.js"), recipes.to_json)
