import { ArrowRight, Image, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import StarRatingInput from './StarRatingInput'

const initialForm = {
  customerName: '',
  customerEmail: '',
  company: '',
  jobTitle: '',
  rating: 0,
  review: '',
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const MIN_REVIEW_LENGTH = 10
const MAX_REVIEW_LENGTH = 2000
const allowedAvatarTypes = ['image/jpeg', 'image/png', 'image/webp']

function validate(values) {
  const errors = {}
  if (!values.customerName.trim()) errors.customerName = 'Please enter your name.'
  if (!values.customerEmail.trim()) errors.customerEmail = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.customerEmail.trim())) errors.customerEmail = 'Enter a valid email address.'
  if (!values.rating) errors.rating = 'Please choose a rating.'
  if (!values.review.trim()) errors.review = 'Please share a review.'
  else if (values.review.trim().length < MIN_REVIEW_LENGTH) errors.review = `Your review needs at least ${MIN_REVIEW_LENGTH} characters.`
  else if (values.review.trim().length > MAX_REVIEW_LENGTH) errors.review = `Keep your review under ${MAX_REVIEW_LENGTH} characters.`
  return errors
}

export default function TestimonialForm({ onSubmit, submitting, uploadProgress, error, accentColor }) {
  const [values, setValues] = useState(initialForm)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!avatarFile) {
      queueMicrotask(() => setAvatarPreview(null))
      return undefined
    }

    const previewUrl = URL.createObjectURL(avatarFile)
    let active = true
    queueMicrotask(() => {
      if (active) setAvatarPreview(previewUrl)
    })
    return () => {
      active = false
      URL.revokeObjectURL(previewUrl)
    }
  }, [avatarFile])

  const updateField = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const updateRating = (rating) => {
    setValues((current) => ({ ...current, rating }))
    setErrors((current) => ({ ...current, rating: undefined }))
  }

  const updateAvatar = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedAvatarTypes.includes(file.type)) {
      setAvatarFile(null)
      setErrors((current) => ({ ...current, avatar: 'Choose a JPG, PNG, or WEBP image.' }))
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarFile(null)
      setErrors((current) => ({ ...current, avatar: 'Your image must be 5 MB or smaller.' }))
      return
    }

    setAvatarFile(file)
    setErrors((current) => ({ ...current, avatar: undefined }))
  }

  const clearAvatar = () => {
    setAvatarFile(null)
    setErrors((current) => ({ ...current, avatar: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)))
    if (avatarFile) formData.append('avatar', avatarFile)
    await onSubmit(formData)
  }

  return (
    <form className="collect-form" onSubmit={handleSubmit} noValidate style={{ '--collect-accent': accentColor }}>
      <div className="collect-form__intro"><span className="eyebrow">Your perspective</span><h2>Tell us what you think.</h2><p>A few honest words can help someone else make a confident decision.</p></div>
      <div className="collect-form__fields">
        <div className="collect-field"><label htmlFor="collect-name">Your name</label><input id="collect-name" name="customerName" value={values.customerName} onChange={updateField} autoComplete="name" aria-invalid={Boolean(errors.customerName)} required />{errors.customerName && <span className="form-field-error" role="alert">{errors.customerName}</span>}</div>
        <div className="collect-field"><label htmlFor="collect-email">Email address</label><input id="collect-email" name="customerEmail" type="email" value={values.customerEmail} onChange={updateField} autoComplete="email" aria-invalid={Boolean(errors.customerEmail)} required />{errors.customerEmail && <span className="form-field-error" role="alert">{errors.customerEmail}</span>}</div>
        <div className="collect-field"><label htmlFor="collect-company">Company <span>Optional</span></label><input id="collect-company" name="company" value={values.company} onChange={updateField} autoComplete="organization" /></div>
        <div className="collect-field"><label htmlFor="collect-job-title">Job title <span>Optional</span></label><input id="collect-job-title" name="jobTitle" value={values.jobTitle} onChange={updateField} autoComplete="organization-title" /></div>
        <div className="collect-field collect-field--wide"><StarRatingInput value={values.rating} onChange={updateRating} error={errors.rating} /></div>
        <div className="collect-field collect-field--wide"><label htmlFor="collect-review">Your review</label><textarea id="collect-review" name="review" value={values.review} onChange={updateField} rows="6" maxLength={MAX_REVIEW_LENGTH} placeholder="What stood out to you?" aria-invalid={Boolean(errors.review)} required /><div className="collect-field__meta"><span>{errors.review ? <span className="form-field-error" role="alert">{errors.review}</span> : 'A useful review is specific and honest.'}</span><span>{values.review.length}/{MAX_REVIEW_LENGTH}</span></div></div>
        <div className="collect-field collect-field--wide"><label htmlFor="collect-avatar"><Image size={14} /> Avatar image <span>Optional · JPG, PNG, WEBP · 5 MB max</span></label><input ref={fileInputRef} id="collect-avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateAvatar} aria-invalid={Boolean(errors.avatar)} />{avatarPreview && <div className="avatar-upload-preview"><img src={avatarPreview} alt="Selected avatar preview" /><button className="icon-button" type="button" onClick={clearAvatar} aria-label="Remove selected avatar"><X size={16} /></button><span>{avatarFile.name}</span></div>}{errors.avatar && <span className="form-field-error" role="alert">{errors.avatar}</span>}</div>
      </div>
      {error && <p className="form-message form-message--error" role="alert">{error}</p>}
      {submitting && uploadProgress > 0 && <div className="upload-progress" aria-live="polite"><div><span>Uploading image</span><span>{uploadProgress}%</span></div><progress value={uploadProgress} max="100" /></div>}
      <button className="button collect-submit" type="submit" disabled={submitting} style={{ backgroundColor: accentColor }}>{submitting ? 'Sending your story...' : 'Send testimonial'} <ArrowRight size={17} /></button>
      <p className="collect-form__privacy">Your testimonial will be reviewed before it is shared publicly.</p>
    </form>
  )
}
