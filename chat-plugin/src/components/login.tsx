import { Button } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
// import MinimizeIcon from "@material-ui/icons/Minimize";
import { RegisterGuestOrLoginMutationComponent } from "../generated/apolloComponents";

import TextInputField from "./textInputField";
import * as yup from "yup";
import { guestMeQuery } from "../graphql/user/query/guestMeQuery";
import CardHeader from "./reusable/CardHeader";

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required("Email is required.")
    .min(2, "First Name should have at least 2 characters."),
  firstname: yup.string().required("Firstname is required."),
  lastname: yup.string().required("Lastname is required.")
});

interface ILoginFormProps {
  minimize: () => void;
}

const Login: React.FC<ILoginFormProps> = ({ minimize }) => {
  // const { data, loading } = useQuery<MeQueryResult, MeQueryVariables>(meQuery)

  const TextInputFieldGenerator = ({
    placeholder,
    name,
    type = "text"
  }: {
    placeholder: string;
    name: string;
    type?: string;
  }) => {
    return (
      <div className="form-control">
        <Field
          name={name}
          type={type}
          label={placeholder}
          component={TextInputField}
          placeholder={placeholder}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="wl-chatOrLoginScreen">
        <div
          style={{
            background: "white"
            // padding: "1rem",
            // borderRadius: "1rem",
            // border: "1px solid #deded3"
          }}
        >
          <CardHeader minimize={minimize} title="Chat With Us!" />
          <div style={{ padding: "1rem" }}>
            <RegisterGuestOrLoginMutationComponent>
              {(mutate, loginResponse) => {
                return (
                  <Formik
                    initialValues={{
                      email: "",
                      lastname: "",
                      firstname: ""
                    }}
                    validationSchema={schema}
                    validateOnBlur={true}
                    validateOnChange={false}
                    onSubmit={async (data, { setErrors }) => {
                      try {
                        await mutate({
                          variables: {
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email
                          },

                          update: async (cache, { data, context }) => {
                            if (!data) {
                              return;
                            }

                            if (
                              data.registerGuestOrLogin &&
                              data.registerGuestOrLogin.__typename
                            ) {
                              if (cache.writeQuery) {
                                cache.writeQuery({
                                  query: guestMeQuery,
                                  data: {
                                    guestMe: {
                                      __typename: "Guest",
                                      avatar: data.registerGuestOrLogin.avatar,
                                      email: data.registerGuestOrLogin.email,
                                      id: data.registerGuestOrLogin.id,
                                      name: data.registerGuestOrLogin.name,
                                      firstName:
                                        data.registerGuestOrLogin.firstName,
                                      lastName:
                                        data.registerGuestOrLogin.firstName,
                                      channelId:
                                        data.registerGuestOrLogin.channelId
                                    },
                                    __typename: "Query"
                                  }
                                });
                              }
                            }
                          }
                        });

                        if (
                          loginResponse &&
                          loginResponse.data &&
                          !loginResponse.data.registerGuestOrLogin
                        ) {
                          setErrors({
                            email:
                              "Server Error. Unable To Login. Plaese verify and try again."
                          });
                          return;
                        } else {
                          console.log(loginResponse.data);
                        }
                      } catch (e) {
                        setErrors({
                          email: "Unable To Login. Plaese verify and try again."
                        });
                      }
                    }}
                  >
                    {() => (
                      <div className="wl-container">
                        <Form>
                          {TextInputFieldGenerator({
                            name: "firstname",
                            placeholder: "Firstname"
                          })}
                          {TextInputFieldGenerator({
                            name: "lastname",
                            placeholder: "Lastname"
                          })}
                          {TextInputFieldGenerator({
                            name: "email",
                            placeholder: "Email",
                            type: "email"
                          })}
                          <br />
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loginResponse.loading}
                          >
                            Start Chat
                          </Button>
                        </Form>
                      </div>
                    )}
                  </Formik>
                );
              }}
            </RegisterGuestOrLoginMutationComponent>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
