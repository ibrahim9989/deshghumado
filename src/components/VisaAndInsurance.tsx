type VisaProps = {
  country?: string;
};

export default function VisaAndInsurance({ country = 'Singapore' }: VisaProps) {
  return (
    <section className="px-6 lg:px-16 py-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Visa</h2>

        <div className="rounded-2xl border border-gray-200 p-6 mb-10">
          <h3 className="text-xl font-semibold mb-2">E-Visa</h3>
          <h4 className="text-lg font-medium mb-4">{country} Tourist Visa</h4>
          <p className="text-gray-700 mb-6">
            {country} visa is mandatory for Indian Passport holders. Apply 30 days early with accurate
            documents. Processing takes 7 to 8 days.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-semibold mb-3">Inclusions</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Actual Visa fees and processing</li>
                <li>Documentation assistance and verification</li>
                <li>Form filling and submission</li>
                <li>Status tracking and updates until approval</li>
                <li>E-visa copy shared directly via email upon approval</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Exclusions</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Any urgent or express visa processing charges (if applicable)</li>
                <li>Air tickets (international or domestic)</li>
                <li>Travel insurance</li>
                <li>Courier charges</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <h3 className="text-2xl font-bold mb-2">Travel Insurance Illustration</h3>
          <h4 className="text-lg font-medium mb-1">Travel Insurance</h4>
          <p className="text-gray-700 mb-6">Secure travel insurance for {country}</p>

          <p className="text-gray-700 mb-4">
            This is the average cost. Depending on the actual age of the travellers, the final cost will
            vary. We will update you when it does, be rest assured.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="font-semibold">₹ 50K for Excl-Silver</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="font-semibold">₹ 70K for Excl-Silver for 2 travellers</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            Insurance prices are purely based on the age band you fall under. Prices might change once you
            input your age details in the next screen.
          </p>
        </div>
      </div>
    </section>
  );
}



