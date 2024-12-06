import { FC, useEffect, useState } from "react";
import styles from "components/ToogleSwitch/styles.module.scss";

const ToogleSwitch: FC<{
  value: boolean;
  customSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ value = false, customSetter = () => {} }) => {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    customSetter(value);
    setIsToggled(value);
  }, [value, customSetter, setIsToggled]);

  useEffect(() => {
    customSetter(isToggled);
  }, [isToggled, customSetter]);

  return (
    <label className={styles["toggle-switch"]}>
      <input
        id="toogle-switch"
        type="checkbox"
        checked={isToggled}
        onChange={() => {
          setIsToggled((prev) => !prev);
        }}
      />
      <span className={styles.switch} />
    </label>
  );
};
export default ToogleSwitch;
