import { Page } from "@xata.io/client";

import { RelProfilesRecord } from "@/lib/xata";
import { ProfileCard } from "./profile-card";

const ProfileListPaginated = ({
  profiles_page,
}: {
  profiles_page: Page<RelProfilesRecord>;
}) => {
  if (profiles_page.records.length === 0) {
    return <div>Nada que ver por acá {";)"}</div>;
  } else if (profiles_page.records.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {profiles_page.records.map((rel) =>
          rel?.profile_a?.handle ? (
            <ProfileCard key={rel.profile_a.id} profile={rel.profile_a} />
          ) : rel?.profile_b?.handle ? (
            <ProfileCard key={rel.profile_b.id} profile={rel.profile_b} />
          ) : null
        )}
      </div>
    );
  } else {
    return <div>Error</div>;
  }
};

export { ProfileListPaginated };
