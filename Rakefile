
require 'rake'
require 'rake-version'

DEPS = {
  'jshint' => 'hint',
  'uglify-js' => 'uglifyjs',
  'vows' => 'vows'
}

ROOT = File.expand_path File.dirname(__FILE__)
SRC = File.join ROOT, 'src'

def script_path dep
  File.join ROOT, 'node_modules', dep, 'bin', DEPS[dep]
end

desc 'Run test suite, validate and compress javascript.'
task :build => [ :spec, :check, :minify ]

desc 'Validate javascript.'
task :check => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'jshint'} "#{File.join SRC, 'eventful.js'}"/
  fail 'Javascript has errors.' unless result
end

desc 'Compress javascript.'
task :minify => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'uglify-js'} -o "#{File.join SRC, 'eventful.min.js'}" "#{File.join SRC, 'eventful.js'}"/
  fail 'Could not compress javascript.' unless result
end

desc 'Run test suite.'
task :spec => [ :validate_presence_of_deps ] do |t|
  result = system %/#{script_path 'vows'} --spec #{File.join ROOT, 'spec', '*'}/
  fail 'Test suite failed.' unless result
end

# version tasks
RakeVersion::Tasks.new do |v|
  v.copy 'src/eventful.js', 'package.json'
end

task :validate_presence_of_deps do |t|
  DEPS.each_key do |dep|
    bin_path = script_path dep
    raise "Missing binary #{bin_path}. Run 'npm install'." unless File.exists? bin_path
  end
end
