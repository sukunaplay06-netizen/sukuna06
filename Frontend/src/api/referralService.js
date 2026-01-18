import api from "./axios";

class ReferralService {
  // Get complete referral metrics
  async getReferralMetrics() {
    try {
      console.log("🚀 ReferralService: Fetching referral metrics...");

      let token = null;
      let userData = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
        userData = localStorage.getItem("user");
      }

      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      if (!userData) {
        throw new Error("No user data found. Please login again.");
      }

      console.log("🔑 Token exists:", !!token);
      console.log("👤 User data exists:", !!userData);

      const response = await api.get("/referral/metrics");

      console.log("✅ Referral metrics received:", response.data);

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format from server");
      }

      return {
        success: true,
        data: {
          metrics: response.data,
        },
      };
    } catch (error) {
      console.error("❌ ReferralService Error:", error);

      let errorMessage = "Failed to fetch referral data";

      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else if (error.response?.status === 404) {
        errorMessage = "Referral endpoint not found.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage =
          "Cannot connect to server. Please ensure backend is running.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || error.message,
      };
    }
  }

  async getReferralDownline() {
    try {
      const response = await api.get("/referral/downline");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch downline data",
        details: error.response?.data || error.message,
      };
    }
  }
  async testConnection() {
    try {
      const response = await api.get("/referral/test");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Backend connection failed",
        details: error.response?.data || error.message,
      };
    }
  }
}
export default new ReferralService();
