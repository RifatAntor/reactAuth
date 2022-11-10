import { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const passInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const formSubmitHandler = () => {
    const enteredPass = passInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAFAyJdm0Qc89CT65x6URTuErzIlhJjed0",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredPass,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json' 
        }
      }
    ).then(res => {
      //...
      history.replaceState('/');
    }) ;
  };
  return (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={passInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
