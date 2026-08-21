import { ChangeEvent, ChangeEventHandler, SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import { AppForm } from "../components/common/appForm";
import { AppSpinner } from "../components/common/appSpinner";
import { Button } from "../components/common/button";
import { ProfileInfo, useAuth } from "../providers/auth";
import { useSession } from "../providers/session";
import {
  getPromise,
  isAuthenticationError,
  post,
} from "../util/generalActions";

export const Profile = () => {
  const { token, profile, setProfile } = useAuth();
  const { setGoBackFromLogin } = useSession();
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const reader = new FileReader();
      reader.onload = (fileLoadedEvent) => {
        // call api here
        console.log((fileLoadedEvent.target as any).result.split(";base64,"));
        setImage((fileLoadedEvent.target as any).result);
      };
      reader.readAsDataURL((event.target.files as FileList)[0]);
    }
  };
  const saveChanges = async () => {
    setLoading(true);
    try {
      await post(
        "/profiles/profile/modify",
        image ? { ...profile, image: image.split(";base64,")[1] } : profile,
        token as string
      );
      getPromise<ProfileInfo>("/profiles/profile", token as string)
        .then((profile) => {
          setProfile(profile);
        })
        .catch((error) => {
          if (isAuthenticationError(error)) {
          }
        });
    } catch (error) {
      if (isAuthenticationError(error)) {
        setGoBackFromLogin("/profile");
      } else {
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <AppSpinner loading={loading || profile == undefined} />
      {profile && profile.email && (
        <div className="flex md:flex-row flex-col justify-evenly">
          <div className="flex flex-col items-center">
            <img
              src={
                image
                  ? image
                  : profile.imageUrl
                  ? "data:image/png;base64, " + profile.imageUrl
                  : "/assets/images/profile.png"
              }
              className="rounded-full cursor-pointer inline flex-grow-0 flex-shrink-0 h-48 w-48  mr-1 mt-14"
            ></img>
            <label className="cursor-pointer mt-4 font-bold text-white text-x rounded-md p-4 bg-profile-blue hover:bg-blue-800 outline-none">
              <input
                className="hidden"
                type="file"
                name="file"
                accept=".png,.jpg,.jpeg"
                onChange={onChangeHandler}
              />
              Upload your picture
            </label>
            <p className="text-xl font-bold mt-6 blue">{profile.email}</p>
          </div>
          <div className="flex flex-col items-center">
            <AppForm
              names={[
                {
                  mandatory: true,
                  type: "text",
                  hardLabel: "First Name",
                  name: "fname",
                  value: profile.fname,
                },
                {
                  mandatory: true,
                  type: "text",
                  hardLabel: "Last Name",
                  name: "lname",
                  value: profile.lname,
                },
              ]}
              submit="Save Changes"
              onSubmit={saveChanges}
              inline={false}
              title="Your Information"
              submitClass="mt-2 p-2 rounded-xl py-3 font-bold text-white text-xl outline-none w-72 bg-green-400 hover:bg-green-600"
              className="w-72 mt-14"
            />
            <Button className="mt-2 p-2 rounded-xl py-3 font-bold text-white text-xl outline-none w-72 bg-indigo-400 hover:bg-indigo-600">
              Reset Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
