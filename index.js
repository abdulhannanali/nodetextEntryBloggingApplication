// Blog entry files parsing logic
// Reads blog entries from the text files and displays them


var fs = require("fs");
var http = require("http");

function getEntries(){
	var entries = [];
	var entriesRaw = fs.readFileSync('./entries.txt', 'utf-8');
	entriesRaw = entriesRaw.split('---');
	entriesRaw.map(function(entryRaw){
		var entry = {};
		var lines = entryRaw.split("\n");
		lines.map(function(line){
			if (line.indexOf('title: ') === 0){
				entry.title = line.replace('title: ', " ");
			}
			if (line.indexOf('date: ') === 0){
				entry.date = line.replace('date: ', " ");
			}
			else {
				entry.body = entry.body || '';
				entry.body += line;
			}
		});
		entries.push(entry);
	});
	return entries;
}

var entries = getEntries();

// serving the following entries through a http web application
http.createServer(function(req, res){
	var output = blogPage(entries);
	res.writeHead(200, {'Content-type':'text/html'});
	res.end(output);	
}).listen(3000);


/// Not templated approch to display blog entries
/// This will result in cluttered code and mixing of presentation with logic is not
/// a real good thing
function blogPage(entries){
	var output	= "<html>"
				+ "<head>"
				+ "<style type='text/css'>"
				+ ".entry_title {font-weight: bold;}"
				+ ".entry_date {font-style: italic;}"
				+ ".entry_body {margin-bottom: 1em;}"
				+ "</style>"
				
				+ "<body>";

		entries.map(function(entry){
			output	+=	"<div class=\"entry_title\">" + entry.title + "</div>\n"
					+	"<div class=\"entry_date\">"	+ entry.date  + "</div>\n"
					+	"<div class=\"entry_body\">"	+ entry.body  + "</div>\n";
		});
		output += "</body></html>";
		return output;


}