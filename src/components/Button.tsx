interface ButtonPros {
  ButtonName: string;
  ClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({ ButtonName, ClickHandler }: ButtonPros) {
  return (
    <button type="button" className="btn btn-primary" onClick={ClickHandler}>
      {ButtonName}
    </button>
  );
}

export default Button;
