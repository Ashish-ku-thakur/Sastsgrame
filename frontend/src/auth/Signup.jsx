import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_API } from "@/lib/utils";
import { setAuthuser } from "@/redux/userSlicer";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  let [isSignin, setIsSignin] = useState(true);

  let [text, setText] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let changeState = () => {
    setIsSignin(!isSignin);
  };

  let setValueHandler = (e) => {
    setText({ ...text, [e?.target?.name]: e?.target?.value });
  };

  // useEffect(() => {
  //   // dispatch(setOnlineUsers(onlineUsers.filter((elm) => elm._id != authUser._id)));
  //   formSubmitHandler();
  // }, [authUser?._id, setAuthuser]);
  // new user created
  let formSubmitHandler = async (e) => {
    e?.preventDefault();

    try {
      let response = await axios.post(`${USER_API}/register`, text, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        dispatch(setAuthuser(response?.data?.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  // login user
  let formLoginHandler = async (e) => {
    e?.preventDefault();

    try {
      let response = await axios.post(`${USER_API}/login`, text, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        dispatch(setAuthuser(response?.data?.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={isSignin ? formSubmitHandler : formLoginHandler}
        className="border border-white p-9 rounded-2xl shadow-2xl"
      >
        {/* headings */}
        <div className="mb-7">
          <h1 className="font-semibold text-2xl text-center mb-2 uppercase">
            Welcome in Sastagrame
          </h1>
          <h2 className="text-xl font-semibold">
            <span>{isSignin == false ? "Login" : "Sign up"}</span> for see
            photos and videos from your friends
          </h2>
        </div>

        {/* form items */}
        {isSignin == false ? (
          <div className="gap-4 flex flex-col">
            <div>
              <Label className="text-xl" htmlFor="email">
                Email:
              </Label>
              <Input
                type="email"
                placeholder="Enter your Email"
                id="email"
                className="focus-visible:ring-transparent"
                name="email"
                value={text?.email}
                onChange={setValueHandler}
              />
            </div>

            <div>
              <Label className="text-xl" htmlFor="password">
                Password:
              </Label>
              <Input
                type="password"
                placeholder="Enter your Password"
                id="password"
                className="focus-visible:ring-transparent"
                name="password"
                value={text?.password}
                onChange={setValueHandler}
              />
            </div>
          </div>
        ) : (
          <div className="gap-4 flex flex-col">
            <div>
              <Label className="text-xl" htmlFor="name">
                Fullname:
              </Label>
              <Input
                type="text"
                placeholder="Enter your Name"
                id="name"
                className="focus-visible:ring-transparent"
                name="fullname"
                value={text?.fullname}
                onChange={setValueHandler}
              />
            </div>

            <div>
              <Label className="text-xl" htmlFor="email">
                Email:
              </Label>
              <Input
                type="email"
                placeholder="Enter your Email"
                id="email"
                className="focus-visible:ring-transparent"
                name="email"
                value={text?.email}
                onChange={setValueHandler}
              />
            </div>

            <div>
              <Label className="text-xl" htmlFor="password">
                Password:
              </Label>
              <Input
                type="password"
                placeholder="Enter your Password"
                id="password"
                className="focus-visible:ring-transparent"
                name="password"
                value={text?.password}
                onChange={setValueHandler}
              />
            </div>
          </div>
        )}

        <div className="gap-4 flex flex-col">
          {/* link login or sign  up */}
          <div className="mt-2">
            <p className="text-center">
              Already have any account? please{" "}
              <span
                className="text-blue-500 font-bold cursor-pointer"
                onClick={changeState}
              >
                {isSignin == false ? "Sign up" : "Login"}
              </span>
            </p>
          </div>

          {/* SUBMIT BTN */}
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-800 text-xl"
          >
            {isSignin == false ? "Login" : "Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
