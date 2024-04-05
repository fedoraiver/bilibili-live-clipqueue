interface SwitchPros {
  SwitchName: string;
  Checked: boolean;
  ClickHandler: (checked: boolean) => void;
}

function Switch({ SwitchName, Checked, ClickHandler }: SwitchPros) {
  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          checked={Checked}
          onChange={(e) => ClickHandler(e.target.checked)}
        ></input>
        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
          {SwitchName}
        </label>
      </div>
    </>
  );
}

export default Switch;
