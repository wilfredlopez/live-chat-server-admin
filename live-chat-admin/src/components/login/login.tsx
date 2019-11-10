import { useQuery } from "@apollo/react-hooks"
import { Button, Container } from "@material-ui/core"
import { Field, Form, Formik } from "formik"
import React, { useEffect } from "react"
import { RouteComponentProps } from "react-router-dom"
import {
  LoginComponent,
  MeQueryResult,
  MeQueryVariables,
} from "../../generated/apolloComponents"
import { meQuery } from "../../graphql/user/query/meQuery"
import TextInputField from "../shared/textInputField"
import * as yup from "yup"

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required("Email is required.")
    .min(2, "First Name should have at least 2 characters."),
  password: yup
    .string()
    .required("Password is required.")
    .min(5, "The Password should have at least 5 characters."),
})

interface ILoginFormProps extends RouteComponentProps {}

const Login: React.FC<ILoginFormProps> = props => {
  const { data, loading } = useQuery<MeQueryResult, MeQueryVariables>(meQuery)

  const { state } = props.location
  const { push } = props.history
  useEffect(() => {
    if (!loading && data) {
      const { me }: any = data
      if (me) {
        if (state && state.next) {
          //redirects to the previews page that user was located at
          push(state.next)
        } else {
          //if no previews page was found then redirects to add-product page
          push("/dashboard")
        }
      }
    }
  }, [loading, data, push, state])

  const TextInputFieldGenerator = ({
    placeholder,
    name,
    type = "text",
  }: {
    placeholder: string
    name: string
    type?: string
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
    )
  }

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <LoginComponent>
          {(mutate, loginResponse) => {
            return (
              <Formik
                validationSchema={schema}
                validateOnBlur={true}
                validateOnChange={false}
                onSubmit={async (data, { setErrors }) => {
                  try {
                    await mutate({
                      variables: {
                        password: data.password,
                        email: data.email,
                      },

                      update: async (cache, { data, context }) => {
                        if (!data) {
                          return
                        }

                        if (data.login && data.login.__typename) {
                          if (cache.writeQuery) {
                            cache.writeQuery({
                              query: meQuery,
                              data: {
                                me: {
                                  __typename: "User",

                                  email: data.login.email,
                                  id: data.login.id,
                                  name: data.login.name,
                                  firstName: data.login.firstName,
                                  lastName: data.login.firstName,
                                },
                                __typename: "Query",
                              },
                            })
                            props.history.push("/dashboard")
                          }
                        }
                      },
                    })

                    if (
                      loginResponse &&
                      loginResponse.data &&
                      !loginResponse.data.login
                    ) {
                      setErrors({
                        email:
                          "Server Error. Unable To Login. Plaese verify and try again.",
                      })
                      return
                    } else {
                      console.log(loginResponse.data)
                    }
                  } catch (e) {
                    setErrors({
                      email: "Unable To Login. Plaese verify and try again.",
                    })
                  }
                }}
                initialValues={{
                  email: "",
                  password: "",
                }}
              >
                {() => (
                  <Container maxWidth="sm">
                    <Form>
                      {TextInputFieldGenerator({
                        name: "email",
                        placeholder: "Email",
                      })}
                      {TextInputFieldGenerator({
                        name: "password",
                        placeholder: "Password",
                        type: "password",
                      })}
                      <br />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loginResponse.loading}
                      >
                        Login
                      </Button>
                    </Form>
                  </Container>
                )}
              </Formik>
            )
          }}
        </LoginComponent>
      </Container>
    </React.Fragment>
  )
}

export default Login
