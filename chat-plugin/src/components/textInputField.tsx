import React from "react"
import { FieldProps } from "formik"
import { TextField } from "@material-ui/core"

interface ITextInputFieldProps extends FieldProps {
  // name: string
  // value: string
  placeholder: string
}

const TextInputField: React.FunctionComponent<ITextInputFieldProps> = ({
  field,
  form,
  placeholder,
  ...props
}) => {
  const errorMessage = form.touched[field.name] && form.errors[field.name]

  return (
    <React.Fragment>
      <div style={{ width: "100%", marginTop: 10 }}>
        <TextField
          {...field}
          {...props}
          // helperText={errorMessage}
          placeholder={placeholder}
          label={placeholder}
          fullWidth
          variant="outlined"
        />

        {errorMessage && (
          <div>
            <p style={{ color: "red" }}>{errorMessage}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default TextInputField
