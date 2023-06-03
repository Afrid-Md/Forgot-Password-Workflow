import { Form, Button, FloatingLabel } from "react-bootstrap";
import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../auth-context/auth-context";
import "./Form.css";

function SignInForm() {
  const authCtx = useContext(AuthContext);
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotsent, setFOrgotSent]=useState(false);

  const history = useHistory();

  const emialRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emialRef.current.value;
    const password = passwordRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = data.error.message;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const email = data.email.replace(/[@.]/g, "");
        authCtx.login(data.idToken, email);
        history.replace("/homePage");
      })
      .catch((err) => {
        if (err.message === "INVALID_PASSWORD") {
          setPassError(true);

          setTimeout(() => {
            setPassError(false);
          }, 3000);
        } else {
          alert(err.message);
        }
      });
  };


  const authSwitchHandlerInSignUp = () => {
    history.replace("/signup-page");
  };


  const forgotPasswordHandler=(e)=>{
    e.preventDefault();
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4',{
        method:'POST',
        body:JSON.stringify({
          requestType:'PASSWORD_RESET',
          email:emialRef.current.value,
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }).then((res)=>{
        if(res.ok){
          setFOrgotSent(true);
          setTimeout(()=>{
            setFOrgotSent(false);
          },3000)
          return res.json();
  
        }
        else{
          return res.json().then((data)=>{
            throw new Error(data.error.message);
          })
        }
      }).catch((err)=>{
        alert(err.message);
      })

    }   

  return (
    <React.Fragment>
      <Form
        onSubmit={submitHandler}
        className="shadow-lg p-3 mb-5 bg-light rounded border border-3"
        style={{ width: "30%" }}
      >
        <Form.Text className="signUp" style={{ fontSize: "50px" }}>
          Sign in
        </Form.Text>
        <Form.Group className="Inputt">
          <FloatingLabel
            controlId="floatingEmail"
            label="Email"
            className="border border-info"
            style={{ borderRadius: "7px" }}
          >
            <Form.Control type="email" placeholder="Email" ref={emialRef} />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="Inputt">
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="border border-info"
            style={{ borderRadius: "7px" }}
          >
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordRef}
            />
          </FloatingLabel>
        </Form.Group>
        {forgotsent && <p className="green">Reset password link sent to your mail!</p>}
        {passError && <p className="error">invalid Password!</p>}
        <div className="submitbuttonn">
          <button className="forgotbutton" onClick={forgotPasswordHandler}>Forgot Password?</button>
        </div>
        {!loading ? (
          <Form.Group className="submitbuttonn">
            <Button variant="primary" type="submit" className="buttonn">
              Log in
            </Button>
          </Form.Group>
        ) : (
          <p className="validatee">validating your details..</p>
        )}
      </Form>
      <span>
        <button className="switchAuth" onClick={authSwitchHandlerInSignUp}>
          Don't have an account? SignUp
        </button>
      </span>
    </React.Fragment>
  );
}

export default SignInForm;
