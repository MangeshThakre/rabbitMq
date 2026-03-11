console.log("Starting consumer service...");

import amqplib, { ConsumeMessage } from "amqplib";

async function consumeMail() {
  try {
    const connection = await amqplib.connect(
      "amqp://admin:admin123@localhost:5672"
    );

    const channel = await connection.createChannel();

    await channel.assertQueue("mail_queue", { durable: false });

    console.log("Waiting for messages in mail_queue...");

    channel.consume("mail_queue", (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Received message:", messageContent);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming message from RabbitMQ:", error);
  }
}
consumeMail();
