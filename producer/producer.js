const fs = require("fs"),
    parse = require("csv-parse"),
    kafka = require("kafka-node"),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client("localhost:2181/"),
    producer = new Producer(client),
    KeyedMessage = kafka.KeyedMessage;

const checkDate = function (d) {
	if (Object.prototype.toString.call(d) === "[object Date]") {
		if (isNaN(d.getTime())) {
			return false;
		} else {
			return true;
		}
	} else {
		return null;
	}
};
	
producer.on("ready", function () {
    fs.createReadStream("file.csv").pipe(parse({ delimiter: "," }, function (error, list) {
        for (let i = 0; i < list.length; i++) {
            let d1 = new Date(list[i][1]);
            if (!checkDate(d1)) continue;
            let d2 = new Date(list[i][2]);
            let item = { name: list[i][0], d1: d1, d2: checkDate(d2) ? d2 : new Date() };
            let payloads = [
                { topic: "topic1", messages: new KeyedMessage(item.name, JSON.stringify(item)) }
            ];
            setTimeout(function () {
                producer.send(payloads, function (err, data) {
                    console.log("Send " + i + " of " + list.length + ":\n\t" + JSON.stringify(item) + "\n\t" + JSON.stringify(data));
                });
            }, i * (500 + (Math.random() - 0.5) * 500));
        }
    }));
});

producer.on("error", function (err) {
    console.log(err);
});