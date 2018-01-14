const SEND_PAYMENT_FORWARD = 'SEND_PAYMENT_FORWARD';
const SEND_PAYMENT_BACKWARD = 'SEND_PAYMENT_BACKWARD';
const PAY_BILL_FORWARD = 'PAY_BILL_FORWARD';
const PAY_BILL_BACKWARD = 'PAY_BILL_BACKWARD';


export const sendPaymentForward = (stepData) => { return { type: SEND_PAYMENT_FORWARD, stepData } };
export const sendPaymentBackward = (stepData) => { return { type: SEND_PAYMENT_BACKWARD, stepData } };
export const payBillForward = (stepData) => { return { type: PAY_BILL_FORWARD, stepData } };
export const payBillBackward = (stepData) => { return { type: PAY_BILL_BACKWARD, stepData } };