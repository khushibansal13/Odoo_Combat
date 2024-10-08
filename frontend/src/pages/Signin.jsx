import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginBottomWarning } from "../components/LoginBottomWarning";
import { LoginButton } from "../components/LoginButton";
import { LoginHeading } from "../components/LoginHeading";
import { LoginInputBox } from "../components/LoginInputBox";
import { LoginSubHeading } from "../components/LoginSubHeading";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState } from "react";
import signinPageImg from "../assets/signinPage.avif";
import { useNavigate } from "react-router-dom";
export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    const requestBody = {
      email,
      password,
    };
    //console.log("Request Body:", requestBody);
    async function logindata() {
      try {
        // console.log("this is all",import.meta.env);
        // console.log("this is us",import.meta.env.VITE_API_URL);
        const backendapi =
          import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${backendapi}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        if (data.success) {
          // window.location.href = "/home";
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("user", JSON.stringify(data.user));
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));

          toast.success(`Welcome back, ${data.user.firstName}!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimeout(() => {
            if (data.user.role === "manager") {
              navigate("/maintenance");
            } else if (data.user.role === "user") {
              navigate("/facility");
            } else if (data.user.role === "admin") {
              navigate("/admin-booking");
            }
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Login failed. Please check your credentials.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        console.log(data);
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred. Please try again later.");
      }
    }
    logindata();
  };
  return (
    <>
      <ToastContainer />
      <div className="bg-slate-950 min-h-screen flex flex-col md:flex-row items-center justify-center p-4">
        <div className="flex flex-col w-full md:w-1/2 mb-10 md:mb-0 px-6">
          <div className="pt-6 md:px-9">
            <LoginHeading label={"Login"} />
            <LoginSubHeading label={"always a pleasure to have you back"} />
            <div className="mt-8">
              <LoginInputBox
                placeholder="Email"
                icon={<MdOutlineMail color="white" />}
                value={email}
                onChange={setEmail}
              />
              <LoginInputBox
                placeholder="Password"
                icon={<RiLockPasswordLine color="white" />}
                value={password}
                onChange={setPassword}
              />
            </div>
            <div className="mt-10">
              <LoginButton label={"Login"} onClick={handleLogin} />
            </div>
            <LoginBottomWarning
              label={"Dont have an account?"}
              buttonText={"Sign Up"}
              to={"/signup"}
            />
          </div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
            <img
              src={signinPageImg}
              alt="Landing Page"
              className="object-cover max-h-[80vh] max-w-[60vh]"
            />
        </div>
      </div>
    </>
  );
};
