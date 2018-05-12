const request = require("request"),
	cheerio = require("cheerio"),
	json2csv = require("json2csv").parse,
	fs = require("fs");

let host = "https://en.wikipedia.org",
	ref1 = "wiki/List_of_Nobel_laureates";

let headers = ["name", "bday", "dday"];
let delimiter = ","

const stream = fs.createWriteStream("file.csv");

console.log("START"); // !!!

request(host + "/" + ref1, function (error, response, body) {
	if (!error) {
		let $ = cheerio.load(body);

		let list = $(".fn a").map(function() {
			return $(this).attr("href");
		}).get();

		console.log("Get " + list.length); // !!!

		stream.write(headers.join(delimiter) + "\n");

		let count = list.length;
		for (let i = 0; i < count; i++) {
			let link = list[i];
			setTimeout(request, i * 1000, host + link,  function (error, response, body) {
				if (!error) {
					let $ = cheerio.load(body);

					let name = $(".firstHeading").text();
					let bday = new Date($(".bday").text());
					let dday = new Date($("th:contains('Died')").next().find("span").first().text().replace("(", "").replace(")", ""));

					let csv = json2csv({
						name: name,
						bday: bday,
						dday: dday
					}, {
						header: false,
						delimiter: delimiter
					});

					console.log("Get " + i + " of " + count + ": " + csv); // !!!

					stream.write(csv + "\n");
				} else {
					console.log(error);
				}
			});
		}

	} else {
		console.log(error);
	}
});