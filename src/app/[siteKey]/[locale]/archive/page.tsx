import { Params } from "@/types";

import { redirectToPage } from "@/components/utils/redirectToPage";

const Page = ({ params }: { params: Promise<Params> }) =>
  redirectToPage("archive", params);

export default Page;
