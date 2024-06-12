"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import { Fragment } from "react";
import ApiAlert from "./api-alert";

interface ApiListProps {
  entityId: string;
  entityName: string;
}

const ApiList = ({ entityId, entityName }: ApiListProps) => {
  const router = useRouter();
  const origin = useOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <Fragment>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
    </Fragment>
  );
};

export default ApiList;
