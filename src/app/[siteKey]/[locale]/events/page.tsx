import { Params } from "@/types";

import { redirectToPage } from "@/components/utils/redirectToPage";

const Page = ({ params }: { params: Promise<Params> }) =>
  redirectToPage("events", params);

export default Page;
