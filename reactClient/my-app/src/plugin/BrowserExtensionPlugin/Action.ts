type Action = AddAction | EditAction | LogoutAction;

interface EditAction {
  action: "edit";
  data: { index: number } ;
}

interface AddAction {
  action: "add";
  data: {[index: string]:string};
}

interface LogoutAction {
  action: "logout";
  data: {};
}

export default Action;
