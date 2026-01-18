import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const PayoutSettings = () => {
  const { user } = useContext(AuthContext);
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [confirmIfscCode, setConfirmIfscCode] = useState("");
  const [message, setMessage] = useState("");
  const [alreadySet, setAlreadySet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(
    "Welcome to KYC Settings! You can add details only once after your first sale."
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Validation
  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
  const validateAccountNumber = (account) => /^\d{9,18}$/.test(account);
  const validateIfsc = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  // Fetch existing details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/user/payout-details");
      // console.log("GET /payout-details response:", res.data);
      setPanNumber(res.data.panNumber || "");
      setAadhaarNumber(res.data.aadhaarNumber || "");
      setAccountNumber(res.data.accountNumber || "");
      setConfirmAccountNumber(res.data.accountNumber || "");
      setIfscCode(res.data.ifscCode || "");
      setConfirmIfscCode(res.data.ifscCode || "");
      setAlreadySet(res.data.isKycComplete || false);
      if (
        res.data.panNumber &&
        res.data.aadhaarNumber &&
        res.data.accountNumber &&
        res.data.ifscCode
      ) {
        setAlreadySet(true);
      }
    } catch (err) {
      // console.error("Error fetching payout details:", err.response || err);
      setMessage(
        err.response?.data?.message || "❌ Failed to fetch KYC details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit form
  const updateDetails = async () => {
    // console.log("Sending payload to /account-info:", {
    //   panNumber,
    //   aadhaarNumber,
    //   accountNumber,
    //   ifscCode,
    // });
    if (!validatePan(panNumber)) return setMessage("❌ Invalid PAN number.");
    if (!validateAadhaar(aadhaarNumber))
      return setMessage("❌ Aadhaar must be 12 digits.");
    if (!validateAccountNumber(accountNumber))
      return setMessage("❌ Invalid Account Number.");
    if (accountNumber !== confirmAccountNumber)
      return setMessage(
        "❌ Account Number & Confirm Account Number do not match."
      );
    if (!validateIfsc(ifscCode)) return setMessage("❌ Invalid IFSC Code format.");
    if (ifscCode !== confirmIfscCode)
      return setMessage("❌ IFSC Code & Confirm IFSC Code do not match.");
    try {
      setLoading(true);
      if (alreadySet) {
        setMessage("❌ KYC already completed and cannot be changed.");
        return;
      }
      const res = await axios.post("/user/account-info", {
        panNumber,
        aadhaarNumber,
        accountNumber,
        ifscCode,
      });
      // console.log("POST /account-info response:", res.data);
      setMessage(res.data.message || "✅ KYC details saved successfully!");
      setAlreadySet(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      // console.error("Error saving KYC details:", err.response || err);
      setMessage(
        err.response?.data?.message || "❌ Failed to save KYC details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    const isFromSale = new URLSearchParams(location.search).get("fromSale");
    if (isFromSale && !alreadySet) {
      setMessage("Please complete your KYC to enable withdrawals.");
    }
    setNotification(
      "🔔 Welcome to KYC Settings! You can add details only once after your first sale."
    );
  }, [location]);

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 shadow-xl rounded-2xl bg-white">
        {/* Notification */}
        {notification && (
          <div className="mb-6 p-3 sm:p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-md flex items-start sm:items-center gap-2">
            <span className="text-xl">🔔</span>
            <p className="text-sm sm:text-base font-medium leading-snug">
              {notification}
            </p>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          💸 KYC & Payout Settings
        </h2>

        {loading && (
          <div className="text-center text-gray-500 mb-4 animate-pulse text-sm sm:text-base">
            Loading details...
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-3 sm:space-y-4">
          <Input
            placeholder="PAN Number (ABCDE1234F)"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
          <Input
            placeholder="Aadhaar Number (12 digits)"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
          <Input
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
          <Input
            placeholder="Confirm Account Number"
            value={confirmAccountNumber}
            onChange={(e) => setConfirmAccountNumber(e.target.value)}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
          <Input
            placeholder="IFSC Code (SBIN0001234)"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
          <Input
            placeholder="Confirm IFSC Code"
            value={confirmIfscCode}
            onChange={(e) => setConfirmIfscCode(e.target.value.toUpperCase())}
            disabled={alreadySet || loading}
            className="text-sm sm:text-base"
          />
        </div>

        {/* Button */}
        <Button
          onClick={updateDetails}
          className="w-full mt-6 py-2 sm:py-3 text-sm sm:text-base"
          disabled={alreadySet || loading}
        >
          {alreadySet ? "✅ KYC Completed" : loading ? "Saving..." : "Save KYC"}
        </Button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm sm:text-base font-medium ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </Card>
    </div>
  );
};

export default PayoutSettings;
