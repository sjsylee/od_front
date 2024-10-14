import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { fetchJson } from "@/lib/api";
import { useState } from "react";
import {
  Spacer,
  Button,
  Divider,
  Accordion,
  AccordionItem,
  Image,
  Chip,
  Snippet,
  Link,
} from "@nextui-org/react";
import "boxicons/css/boxicons.min.css";
import { define_account_name } from "@/lib/define_account_name";
import { gen_store_img_link_local, store_full_name } from "@/lib/store_func";
import Head from "next/head";
import * as XLSX from "xlsx";

function exportWorksheet(f_n: string, json: any[], type: string) {
  let myFile = `${f_n}.${type}`;
  let myWorkSheet = XLSX.utils.json_to_sheet(json);
  let myWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "0");
  XLSX.writeFile(myWorkBook, myFile);
}

function count_order(store_object: any) {
  let total = 0;
  const stores = ["CP", "SS", "ST", "IP", "AU", "GM", "LO"];
  stores.map((store) => {
    try {
      let num = store_object[store].length;
      total += num;
    } catch (e) {}
  });
  return total;
}

function unzip(t_d: any[]) {
  const total: any[] = [];
  t_d.map((d) => {
    const d_1: any = Object.values(d)[0];
    console.log(d_1);

    for (let key in d_1 as any) {
      if (d_1.hasOwnProperty(key)) {
        let value = d_1[key];

        if (value.length > 0) {
          total.push(...value);
        }
      }
    }
  });

  return total.map((d) => {
    return {
      계정: d["account"],
      스토어: d["store"],
      구매수량: d["shippingCount"],
      상품번호: d["vendorItemId"],
      비고: "",
      상품명: d["vendorItemName"],
      SKU: d["sku"],
      주문번호: d["orderId"],
    };
  });
}

export const getServerSideProps: GetServerSideProps = async () => {
  const CMS_URL = process.env.CMS_URL;
  const check_data = await fetchJson(`${CMS_URL}/get_total_order`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  return {
    props: { check_data },
  };
};
export default function IndexPage({
  check_data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [totalOrdNum, setTotalOrdNum] = useState<number>(check_data[0]);
  const [totalData, setTotalData] = useState<any[]>(
    check_data[1].map((d: any) => {
      return {
        ...d,
        isExtra: false,
      };
    })
  );

  const scrolltoHash = (element_id: string) => {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <>
      <Head>
        <title>주문 확인</title>
      </Head>
      <div className="m-3">
        <Spacer y={1} />
        <div id="top" className="flex flex-row items-center gap-4">
          <p className="text-xl lg:text-2xl">총 주문개수:</p>
          <h1 className="text-green-400 font-extrabold text-4xl lg:text-5xl">
            {totalOrdNum}
          </h1>
          <Button
            className="inset-y-0 right-0"
            color="success"
            variant="faded"
            size="md"
            onClick={() => {
              console.log(totalData);

              exportWorksheet("주문수집 데이터", unzip(totalData), "xlsx");
            }}
          >
            🍥 엑셀로 출력
          </Button>
        </div>

        <Divider className="my-4" />
        <Spacer y={1} />
        <div className="items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {totalData.map((account) => {
            const act_name = Object.keys(account)[0];
            return (
              <div key={Math.random().toString(36).substr(2, 11)}>
                <div
                  key={Math.random().toString(36).substr(2, 11)}
                  className="flex items-center"
                >
                  <Chip
                    key={"chip" + act_name}
                    color="secondary"
                    variant="faded"
                  >
                    {act_name == "DB" ? "B" : act_name}
                  </Chip>
                  <Spacer x={1} />
                  <Chip
                    radius="sm"
                    variant="faded"
                    onClick={() => {
                      scrolltoHash(act_name);
                    }}
                    as="button"
                  >
                    {define_account_name(act_name)}
                  </Chip>
                  <Spacer x={1} />
                  <Chip
                    radius="sm"
                    variant="shadow"
                    size="lg"
                    color={
                      count_order(account[act_name]) > 0 ? "success" : "default"
                    }
                  >
                    {count_order(account[act_name])}
                  </Chip>
                  <Spacer x={3} />
                </div>
                <Spacer y={1} />
              </div>
            );
          })}
        </div>
        <Divider className="my-4" />
        <Spacer y={1} />
        <div className="items-center gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {totalData.map((account) => {
            const act_name = Object.keys(account)[0];
            const stores = ["CP", "SS", "ST", "IP", "AU", "GM", "LO"];
            return (
              <div key={Object.keys(account)[0]}>
                <div className="flex items-center">
                  <p
                    key={"p " + Object.keys(account)[0]}
                    className="text-lg lg:text-2xl font-bold"
                  >
                    {define_account_name(act_name) + ":"}
                  </p>
                  <Spacer x={5} />
                  {count_order(account[act_name]) > 0 && (
                    <>
                      <p className="text-red-300 font-extrabold text-3xl lg:text-4xl">
                        {count_order(account[act_name]).toString()}
                      </p>
                    </>
                  )}
                </div>
                <Spacer y={3} />
                <div>
                  <Accordion
                    id={act_name}
                    // showDivider={false}
                    className="p-3 flex flex-col gap-1 w-120"
                    variant="shadow"
                    fullWidth
                    selectionMode="multiple"
                  >
                    {stores.map((store: any, index: number) => {
                      return (
                        <AccordionItem
                          key={index}
                          aria-label={store}
                          title={store_full_name(store)}
                          startContent={
                            <div className="flex items-center">
                              <Image
                                src={gen_store_img_link_local(store)}
                                alt={store}
                                width={13}
                              ></Image>
                              <Spacer x={2} />
                              <Chip
                                color={
                                  account[act_name][store].length > 0
                                    ? "success"
                                    : "default"
                                }
                                variant="solid"
                              >
                                {account[act_name][store].length.toString()}
                              </Chip>
                            </div>
                          }
                        >
                          {account[act_name][store].map((dat: any) => {
                            return (
                              <div
                                key={
                                  "key" +
                                  Math.random().toString(36).substr(2, 11) +
                                  dat
                                }
                              >
                                <div key={dat} className="flex items-center">
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                  >
                                    🎁
                                  </Chip>
                                  <Spacer x={1} />
                                  <Snippet
                                    size="sm"
                                    variant="bordered"
                                    className="h-7"
                                    hideSymbol
                                  >
                                    {dat["vendorItemName"]}
                                  </Snippet>
                                  <Spacer x={0.5} />
                                </div>
                                <Spacer y={2} />
                                <div className="flex items-center">
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "41px" }}
                                  >
                                    마진
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="primary"
                                    avatar={<>💵 </>}
                                    variant="faded"
                                    style={{ minWidth: "95px" }}
                                  >
                                    {(
                                      dat[`${store.toLowerCase()}_margin`] *
                                      dat["shippingCount"]
                                    ).toLocaleString() + "원"}
                                  </Chip>
                                  <Spacer x={3} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "41px" }}
                                  >
                                    개수
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color={
                                      dat["shippingCount"] > 1
                                        ? "danger"
                                        : "default"
                                    }
                                    variant="bordered"
                                  >
                                    {dat["shippingCount"]}
                                  </Chip>
                                  <Spacer x={3} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "53px" }}
                                  >
                                    판매가
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="success"
                                    variant="faded"
                                    style={{ minWidth: "79px" }}
                                  >
                                    {dat["totalPrice"].toLocaleString() + "원"}
                                  </Chip>
                                </div>
                                <Spacer y={2} />
                                <div className="flex items-center">
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                  >
                                    SKU
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="warning"
                                    variant="faded"
                                  >
                                    {dat["sku"]}
                                  </Chip>
                                  <Spacer x={3} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "41px" }}
                                  >
                                    링크
                                  </Chip>
                                  <Spacer x={1} />
                                  <Link
                                    isExternal
                                    showAnchorIcon
                                    // href={dat["fst_link"]}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(dat["fst_link"], "_blank");
                                    }}
                                  >
                                    {/* <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    ></a> */}
                                  </Link>

                                  <Spacer x={3} />
                                  <Snippet
                                    className="h-6"
                                    size="sm"
                                    variant="flat"
                                    color="warning"
                                    hideSymbol
                                  >
                                    {dat["vendorItemId"]}
                                  </Snippet>
                                </div>
                                <Spacer y={2} />
                                <div className="flex items-center">
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "41px" }}
                                  >
                                    원가
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="primary"
                                    variant="dot"
                                  >
                                    {dat["unit_price"]}
                                  </Chip>
                                  <Spacer x={3} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "66px" }}
                                  >
                                    구매수량
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color={
                                      dat["order_qty"] > 1
                                        ? "danger"
                                        : "success"
                                    }
                                    variant="flat"
                                  >
                                    {dat["order_qty"]}
                                  </Chip>
                                  <Spacer x={3} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    color="default"
                                    variant="solid"
                                    style={{ minWidth: "53px" }}
                                  >
                                    패키지
                                  </Chip>
                                  <Spacer x={1} />
                                  <Chip
                                    size="sm"
                                    radius="sm"
                                    variant="bordered"
                                  >
                                    {dat["package"]}
                                  </Chip>
                                </div>
                                <Spacer y={4} />
                                <Divider />
                                <Spacer y={4} />
                              </div>
                            );
                          })}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
                <Spacer y={10} />
              </div>
            );
          })}
        </div>
        <Spacer y={2} />
        <Button
          size="lg"
          className="bg-gradient-to-tr from-green-700 to-yellow-700 text-white shadow-lg"
          onClick={() => {
            scrolltoHash("top");
          }}
        >
          🪜 상단으로 이동
        </Button>
      </div>
    </>
  );
}
