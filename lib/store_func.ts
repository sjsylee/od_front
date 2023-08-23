export function gen_store_img_link_local(store_code: string) {
  if (store_code.toUpperCase() === "CP") {
    return "store_icon/cp.png";
  } else if (store_code.toUpperCase() === "IP") {
    return "store_icon/ip.png";
  } else if (store_code.toUpperCase() === "ST") {
    return "store_icon/st.png";
  } else if (store_code.toUpperCase() === "SS") {
    return "store_icon/ss.png";
  } else if (store_code.toUpperCase() === "AU") {
    return "store_icon/au.png";
  } else if (store_code.toUpperCase() === "GM") {
    return "store_icon/gm.png";
  } else if (store_code.toUpperCase() === "LO") {
    return "store_icon/lo.png";
  } else {
    return "";
  }
}

export function store_full_name(store_code: string) {
  if (store_code.toUpperCase() === "CP") {
    return "쿠팡";
  } else if (store_code.toUpperCase() === "IP") {
    return "인터파크";
  } else if (store_code.toUpperCase() === "ST") {
    return "11번가";
  } else if (store_code.toUpperCase() === "SS") {
    return "스마트스토어";
  } else if (store_code.toUpperCase() === "AU") {
    return "옥션";
  } else if (store_code.toUpperCase() === "GM") {
    return "지마켓";
  } else if (store_code.toUpperCase() === "LO") {
    return "롯데온";
  } else {
    return "";
  }
}
