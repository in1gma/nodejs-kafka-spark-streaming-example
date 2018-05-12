# Links
## Kafka
<https://kafka.apache.org/11/documentation/streams/tutorial>
<https://spark.apache.org/docs/2.2.0/streaming-kafka-0-10-integration.html>
<https://github.com/apache/spark/blob/master/examples/src/main/python/streaming/kafka_wordcount.py>

<https://github.com/apache/kafka/blob/trunk/examples/src/main/java/kafka/examples/Producer.java>

<https://github.com/lucasjellema/kafka-streams-running-topN>

## Spark
<https://github.com/radanalyticsio/streaming-amqp/blob/master/python/amqp.py>

<https://habr.com/company/piter/blog/276675/>
<https://habr.com/company/bitrix/blog/274041/>

<https://spark.apache.org/examples.html>
<https://spark.apache.org/docs/latest/streaming-programming-guide.html>

<https://github.com/apache/spark/blob/v2.3.0/examples/src/main/python/streaming/sql_network_wordcount.py>

# How to
## Start servers
### Start ZooKeeper and Kafka
```sh
cd kafka_2.12-1.1.0 && {
	bin/zookeeper-server-start.sh config/zookeeper.properties > /dev/null & \
	bin/kafka-server-start.sh config/server.properties > /dev/null &
}
```

## Show topics
```sh
cd kafka_2.12-1.1.0 &&
bin/kafka-topics.sh --zookeeper localhost:2181 --describe
```

## Start producer
```sh
node producer/producer.js
```

## Start spark app
Maybie require [Spark Project External Kafka Assembly] (https://mvnrepository.com/artifact/org.apache.spark/spark-streaming-kafka-0-8-assembly_2.11/2.3.0)

Example
```sh
spark-2.3.0-bin-hadoop2.7/bin/spark-submit --jars \
	spark-2.3.0-bin-hadoop2.7/spark-streaming-kafka-0-8-assembly_2.11-2.3.0.jar \
	client/client.py \
	localhost:2181 topic1
```