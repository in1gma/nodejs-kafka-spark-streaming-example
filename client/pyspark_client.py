from __future__ import print_function

import sys
import json
import datetime

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils

def parseDate (str):
    return datetime.datetime.strptime(str, "%Y-%m-%dT%H:%M:%S.%fZ")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: client.py <zk> <topic>", file=sys.stderr)
        exit(-1)

    sc = SparkContext(appName="PythonStreamingKafkaTestClient")
    ssc = StreamingContext(sc, 1)

    sc.setLogLevel("ERROR")

    zkQuorum, topic = sys.argv[1:]
    kvs = KafkaUtils.createStream(ssc, zkQuorum, "spark-streaming-consumer", {topic: 1})

    counter = sc.accumulator(0)
    adder = sc.accumulator(0)

    def acc(item):
        counter.add(1)
        adder.add(item[1])

    def process(time, rdd):
        print("========= %s =========" % str(time))
        rdd.foreach(acc)
        print("All Count:\n\t{0}\nAll sum:\n\t{1}\nAvg:\n\t{2}\nData:\n\t{3}".format(counter.value, adder.value, adder.value / counter.value if counter.value != 0 else None, rdd.collect()))

    kvs.map(lambda x: json.loads(x[1])) \
         .map(lambda x: (x["name"], (parseDate(x["d2"]) - parseDate(x["d1"])).days / 365.25)) \
         .foreachRDD(process)

    ssc.start()
    ssc.awaitTermination()