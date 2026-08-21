import React, { useState } from "react";
import { post } from "../util/generalActions";
import { Button } from "./common/button";
import { Tick } from "./common/tick";

export const SendMessage = () => {
  const [success, setSucess] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  return (
    <section className="contact-one text-center flex flex-row justify-center nice-font">
      {success ? (
        <Tick width="300" success="Your messag was sent successfully" />
      ) : (
        <div className="md:w-2/3 lg:w-1/2 w-full px-4">
          <h2 className=" text-center purple-dark text-5xl font-bold mb-8">
            <>
              Get in touch <br />
              with us
            </>
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="contact-one__form contact-form-validated"
            noValidate={true}
          >
            <div className="row low-gutters">
              <div className="col-lg-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>
              <div className="col-lg-6">
                <input
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
              <div className="col-lg-12">
                <textarea
                  placeholder="Write Message"
                  name="message"
                  onChange={(e) => setMessage(e.currentTarget.value)}
                ></textarea>
                <div className="text-center">
                  <Button
                    formButton={true}
                    onClick={() => {
                      message &&
                        name &&
                        email &&
                        post("/public/contact-us/send", {
                          message,
                          email,
                          name,
                        })
                          .then((resp) => setSucess(true))
                          .catch((error) => {
                            console.log(error);
                          });
                    }}
                  >
                    <>Send Request</>
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="result text-center"></div>
        </div>
      )}
    </section>
  );
};
