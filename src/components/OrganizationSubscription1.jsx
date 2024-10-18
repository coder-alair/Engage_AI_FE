import { useEffect, useState } from "react";
import { getLocalStorageItem, VITE_STRIPE_KEY, VITE_STRIPE_PRODUCT } from "../helpers/helper";
import logo from "../assets/Group.svg"
import { Link } from "react-router-dom";
import { Api } from "../api";

const OrganizationSubscription = () => {
  const userData = JSON.parse(getLocalStorageItem("userData"));
  const [paymentType, setPaymentType] = useState(true);

  const handleOffline = () => {
    putUserOnBoard();
    window.location.href = "https://engage-ai.tech/contact-us/";
  }

  const putUserOnBoard = () => {
    let payload = {
      onboarded: null
    }
    Api.putOnboard(payload).then((res) => {
      return;
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className='h-full px-6  pt-4 flex flex-col items-center justify-between'>
      <div className='flex w-full'>
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px]"
        />
      </div>
      <div className="w-screen relative h-screen overflow-y-auto hide-scrollbar pt-10">
        <div className="flex flex-row justify-center gap-2 mb-3">
          <button className={`${paymentType ? "bg-[#3e68c0]" : "bg-[#ccc]"} ${paymentType ? "text-white" : ""} border border-[${paymentType ? "#3e68c0" : ""}] px-4 py-2 rounded-md`} onClick={() => setPaymentType(true)}>Stripe Payment</button>
          <button className={`${!paymentType ? "bg-[#3e68c0]" : "bg-[#ccc]"} ${!paymentType ? "text-white" : ""} border border-[${!paymentType ? "#3e68c0" : ""}] px-4 py-2 rounded-md`} onClick={() => setPaymentType(false)}>Offline Activation</button>
        </div>
        {paymentType && <div className="flex flex-row justify-center text-xs text-red-600">* Please select qty to choose the number of user on the next page.</div>}
        {paymentType ? <div>
          <stripe-pricing-table
            pricing-table-id={VITE_STRIPE_PRODUCT}
            publishable-key={VITE_STRIPE_KEY}
            client-reference-id={userData.userId}
          />
        </div> :
          <div className="mx-auto w-max flex flex-col justify-center h-[15rem]">
            <div className="bg-purple-900 rounded-lg">
              <button onClick={handleOffline} className="h-max p-3 flex text-white" >Contact US</button>
              {/* <Link className="h-max px-3 flex gap-2 md:gap-0 py-2 md:text-xl text-lg font-medium w-fit bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text" to="https://engage-ai.tech/contact-us/" >Contact US</Link> */}
            </div>
          </div>
        }
      </div>
    </div>
  )
}
export default OrganizationSubscription;