/* When building Stripe integrations, you might want your applications to receive events as they occur in your Stripe accounts, so that your backend systems can execute actions accordingly.

Create an event destination to receive events at an HTTPS webhook endpoint. After you register a webhook endpoint, Stripe can push real-time event data to your application’s webhook endpoint when events happen in your Stripe account. Stripe uses HTTPS to send webhook events to your app as a JSON payload that includes an Event object.

Receiving webhook events is particularly useful for listening to asynchronous events such as when a customer’s bank confirms a payment, a customer disputes a charge, a recurring payment succeeds, or when collecting subscription payments. */
/* Verify webhook signatures with Stripe. You perform the verification by providing the event payload, the Stripe-Signature header, and the endpoint’s secret to receive event for security. If verification fails, you get an error. done below using sig  */
import { Request, Response } from "express";
import Stripe from "stripe";
import Purchase from "../models/Purchase";
import Users from "../models/users";
import Course from "../models/Course";



const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);


/* main reason of this controller is to set purchase data with status. we use event returned from stripe for this which makes process more accurate */
export const stripeWebhooks = async (request: Request, response: Response) => {
    const sig = request.headers['stripe-signature'];

  let event;

  try {
    event =  Stripe.webhooks.constructEvent(request.body, sig ?? '', process.env.STRIPE_WEBHOOK_SECRET!);
  }
  catch (err: any) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  };
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
        /* paymentIntent coming from  const session( event.data.object) = await stripe.checkout.sessions.create({ in purchaseCourse in userController. When you create this checkout session, Stripe internally creates a PaymentIntent to track the payment status. The session object that gets returned includes the payment_intent ID, which you can use to track the payment's success or failure.
Webhook Handling:
After the user goes through the Stripe checkout and completes the payment, Stripe sends a webhook to your server with details about the payment.
If the payment succeeds, Stripe sends an event with type payment_intent.succeeded, and the webhook includes the paymentIntent object, which is tied to the session created earlier */
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })

            const purchaseId = session.data[0].metadata?.purchaseId;
            

           const purchaseData = await Purchase.findById(purchaseId);
           const userData = await Users.findById(purchaseData?.userId);
           const courseData = await Course.findById(purchaseData?.courseId);

           
            courseData?.enrolledStudents.push(userData as any);
            await courseData?.save();
 
            userData?.enrolledCourses.push(courseData?._id as any);
            await userData?.save();
             // if used for ts
          if(purchaseData) {
            purchaseData.status = "completed";
            await purchaseData?.save();
            }          
            break;
        }
    case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        })

        const purchaseId = session.data[0].metadata?.purchaseId;
        
       const purchaseData = await Purchase.findById(purchaseId);
       // if used for ts
       if(purchaseData) {
       purchaseData.status = "failed";
       await purchaseData?.save();
    }
        break;
    }
     
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  /* Return a response to acknowledge receipt of the event to Stripe to acknowledge that the webhook event was successfully received and processed */
  response.json({received: true});

};