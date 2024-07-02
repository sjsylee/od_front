export function define_account_name(account: string) {
  let full_name: string;
  full_name = "Not Defined";

  if (account === "S") {
    full_name = "🍊 서전";
  } else if (account == "E") {
    full_name = "🍋 은동";
  } else if (account == "L") {
    full_name = "🍎 리손";
  } else if (account == "O") {
    full_name = "🍉 오금";
  } else if (account == "DB") {
    full_name = "🫐 동반";
  } else if (account == "DG") {
    full_name = "🍒 동구";
  } else if (account == "JS") {
    full_name = "🍌 준승";
  } else {
    full_name = "";
  }
  return full_name;
}
