import { Button } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import MinimizeIcon from "@material-ui/icons/Minimize";
import { RegisterGuestOrLoginMutationComponent } from "../generated/apolloComponents";

import TextInputField from "./textInputField";
import * as yup from "yup";
import { guestMeQuery } from "../graphql/user/query/guestMeQuery";

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
  close: () => void;
}

const Login: React.FC<ILoginFormProps> = ({ close }) => {
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
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            border: "1px solid #deded3"
          }}
        >
          <div
            className="flex m-auto"
            style={{
              padding: "0 6px",
              justifyContent: "space-around",
              display: "flex",
              alignItems: "center",
              border: "1px solid #f4f4f4"
            }}
          >
            <h1 style={{ textAlign: "center", padding: "0", margin: "0" }}>
              Login
            </h1>
            <Button
              onClick={() => close()}
              variant="outlined"
              size="small"
              title="Close"
              // style={{ height: "40px" }}
            >
              <MinimizeIcon />
            </Button>
          </div>
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
    </React.Fragment>
  );
};

export default Login;
