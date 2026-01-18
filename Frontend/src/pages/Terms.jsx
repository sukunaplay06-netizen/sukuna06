import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Terms() {
  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-md">
          Terms & Conditions
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-orange-100 px-4 leading-relaxed">
          Welcome to leadsgurukul! By signing up, you agree to the following terms and conditions:
        </p>
      </section>

      {/* Terms Content */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 sm:p-14 -mt-10 mb-16 relative z-10">
        <ul className="list-disc list-inside space-y-4 text-gray-700 text-left text-lg leading-relaxed">
          {/* <li>You must be at least 18 years old to use our services.</li> */}
          <li>You are responsible for maintaining the confidentiality of your account and password.</li>
          <li>We reserve the right to modify or terminate services at any time without prior notice.</li>
          <li>You agree not to use our platform for any illegal or unauthorized purposes.</li>
        </ul>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link
            to="/auth/signup"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Terms;
