console.log("Starting producer service...");

import amqplib from "amqplib";

async function sendMail() {
  try {
    const connection = await amqplib.connect(
      "amqp://admin:admin123@localhost:5672"
    );

    const channel = await connection.createChannel(); //  create channel to communicate with RabbitMQ
    const exchange = "mail_exchange";
    const routingKey = "send_mail";

    const message = {
      to: "lastUser@example.com",
      from: "sender@example.com",
      subject: "Hello from RabbitMQ",
      body: "hello user, this is a test email sent via RabbitMQ!"
    };

    await channel.assertExchange(exchange, "direct", { durable: false }); // create exchange if it doesn't exist
    await channel.assertQueue("mail_queue", { durable: false }); // create queue if it doesn't exist
    await channel.bindQueue("mail_queue", exchange, routingKey); // bind queue to exchange with routing key

    //   producer
    //      ▼ 
    // mail_exchange
    //      │
    //      │ routingKey: send_mail
    //      ▼
    //   mail_queue
    //      ▼
    //   consumer

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message))); // Sends a message to a exchange so it can be routed to the correct queue.

    console.log("Message sent to RabbitMQ:", message);
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error sending message to RabbitMQ:", error);
  }
}

sendMail();
