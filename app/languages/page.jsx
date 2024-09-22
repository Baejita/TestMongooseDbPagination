import { connectToDatabase } from "@/utils/connectMongo";
import Link from "next/link";

async function getData(perPage, page) {
  try {
    const client = await connectToDatabase();
    const db = client.db("programming");

    const items = await db
      .collection("programming")
      .find({})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .toArray();
    const itemCount = await db.collection("programming").countDocuments({});

    const response = { items, itemCount };

    return response;
  } catch {
    throw new Error("Failed to fetch data. please try again later.");
  }
}

async function LanguagePage({ searchParams }) {
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 8;
  const data = await getData(perPage, page);

  const totalPages = Math.ceil(data.itemCount / perPage);

  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;

  //ทำเลขหน้าเพจไว้กดๆ
  const pageNumbers = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="container mx-auto mt-8  bg-slate-100">
      {data.itemCount}
      <ul className=" grid grid-cols-4 gap-4 text-center ">
        {data.items.map((item) => (
          <li key={item._id} className="bg-green-500 rounded-md p-4 ">
            <p>{item.name}</p>
          </li>
        ))}
      </ul>

      {isPageOutOfRange ? (
        <div>No more pages...</div>
      ) : (
        <div className="flex justify-center items-center mt-16">
          <div className="flex border-[1px] gap-4 rounded-[10px]  border-emerald-300 p-4 ">
            {page === 1 ? (
              <div className="opacity-60" aria-disabled="true">
                Previous
              </div>
            ) : (
              <Link href={`?page=${prevPage}`} aria-label="Previous page">
                Previous
              </Link>
            )}

            {pageNumbers.map((pageNumbers, index) => (
              <Link
                key={index}
                href={`?page=${pageNumbers}`}
                className={
                  page === pageNumbers
                    ? "bg-green-500 fw-bold px-2 rounded-md text-black "
                    : "hover:bg-green-500"
                }
              >
                {pageNumbers}
              </Link>
            ))}

            {page === totalPages ? (
              <div className="opacity-60 ">Next</div>
            ) : (
              <Link href={`?page=${nextPage}`} aria-label="Next page">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguagePage;
