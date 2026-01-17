-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload config';

-- If the above doesn't work immediately, try making a dummy change:
COMMENT ON TABLE public.authenticators IS 'Table for storing WebAuthn credentials';
