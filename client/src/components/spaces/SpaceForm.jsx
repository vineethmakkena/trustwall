import { ArrowLeft, Check, Image, Palette } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const emptyForm = {
  name: '',
  description: '',
  brandName: '',
  logoUrl: '',
  primaryColor: '#7c3aed',
  welcomeTitle: 'Share your experience',
  welcomeMessage: '',
}

const toFormValues = (space) => ({
  name: space?.name || emptyForm.name,
  description: space?.description || emptyForm.description,
  brandName: space?.brandName || emptyForm.brandName,
  logoUrl: space?.logoUrl || emptyForm.logoUrl,
  primaryColor: space?.primaryColor || emptyForm.primaryColor,
  welcomeTitle: space?.welcomeTitle || emptyForm.welcomeTitle,
  welcomeMessage: space?.welcomeMessage || emptyForm.welcomeMessage,
})

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Give your space a name.'
  else if (values.name.trim().length > 120) errors.name = 'Keep the name under 120 characters.'
  if (values.logoUrl && !/^https?:\/\//i.test(values.logoUrl)) errors.logoUrl = 'Use a complete URL beginning with http:// or https://.'
  if (values.primaryColor && !/^#[0-9a-f]{6}$/i.test(values.primaryColor)) errors.primaryColor = 'Use a six-digit hex color, like #7c3aed.'
  return errors
}

export default function SpaceForm({ space, onSubmit, submitting, submitError, submitLabel }) {
  const [values, setValues] = useState(() => toFormValues(space))
  const [errors, setErrors] = useState({})

  const updateField = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return
    await onSubmit({
      ...values,
      name: values.name.trim(),
      logoUrl: values.logoUrl.trim(),
    })
  }

  return (
    <form className="space-form" onSubmit={handleSubmit} noValidate>
      <div className="space-form__section"><span className="eyebrow">The basics</span><h2>Give your space a clear point of view.</h2><p>A name and a little context help customers know they are in the right place.</p></div>
      <div className="space-form__fields">
        <div className="space-form__field space-form__field--wide"><label htmlFor="space-name">Space name</label><input id="space-name" name="name" value={values.name} onChange={updateField} placeholder="North Star Launch" required aria-invalid={Boolean(errors.name)} />{errors.name && <span className="form-field-error" role="alert">{errors.name}</span>}</div>
        <div className="space-form__field"><label htmlFor="brand-name">Brand name <span>Optional</span></label><input id="brand-name" name="brandName" value={values.brandName} onChange={updateField} placeholder="North Star" /></div>
        <div className="space-form__field space-form__field--wide"><label htmlFor="space-description">Description <span>Optional</span></label><textarea id="space-description" name="description" value={values.description} onChange={updateField} placeholder="A short note about this collection." rows="3" /></div>
      </div>
      <div className="space-form__section"><span className="eyebrow">Make it yours</span><h2>Set the first impression.</h2><p>These details shape the space your customers will see.</p></div>
      <div className="space-form__fields">
        <div className="space-form__field"><label htmlFor="logo-url"><Image size={14} /> Logo URL <span>Optional</span></label><input id="logo-url" name="logoUrl" type="url" value={values.logoUrl} onChange={updateField} placeholder="https://..." aria-invalid={Boolean(errors.logoUrl)} />{errors.logoUrl && <span className="form-field-error" role="alert">{errors.logoUrl}</span>}</div>
        <div className="space-form__field"><label htmlFor="primary-color"><Palette size={14} /> Primary color</label><div className="color-field"><input id="primary-color" name="primaryColor" type="color" value={/^#[0-9a-f]{6}$/i.test(values.primaryColor) ? values.primaryColor : '#7c3aed'} onChange={updateField} /><input value={values.primaryColor} onChange={updateField} aria-label="Primary color hex value" name="primaryColor" /></div>{errors.primaryColor && <span className="form-field-error" role="alert">{errors.primaryColor}</span>}</div>
        <div className="space-form__field space-form__field--wide"><label htmlFor="welcome-title">Welcome title</label><input id="welcome-title" name="welcomeTitle" value={values.welcomeTitle} onChange={updateField} placeholder="Share your experience" /></div>
        <div className="space-form__field space-form__field--wide"><label htmlFor="welcome-message">Welcome message <span>Optional</span></label><textarea id="welcome-message" name="welcomeMessage" value={values.welcomeMessage} onChange={updateField} placeholder="Tell customers what kind of story you are looking for." rows="4" /></div>
      </div>
      {submitError && <p className="form-message form-message--error" role="alert">{submitError}</p>}
      <div className="space-form__actions"><Link className="button button--quiet" to="/spaces"><ArrowLeft size={16} /> Cancel</Link><button className="button button--coral" type="submit" disabled={submitting}>{submitting ? 'Saving space...' : submitLabel} <Check size={16} /></button></div>
    </form>
  )
}
