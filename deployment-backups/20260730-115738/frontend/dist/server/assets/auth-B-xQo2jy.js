import { $ as getStoredAuth, Q as clearStoredAuth, a as apiRegister, et as initActivityTracking, i as apiMe, n as apiLogin, nt as setStoredAuth, r as apiLogout, rt as touchActivity } from "./api-CQX857SN.js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/lib/auth.tsx
var AuthContext = createContext(null);
function AuthProvider({ children }) {
	const stored = getStoredAuth();
	const [user, setUser] = useState(stored.user);
	const [token, setToken] = useState(stored.token);
	const [isLoading, setIsLoading] = useState(!!stored.token);
	useEffect(() => {
		const { token: storedToken } = getStoredAuth();
		if (!storedToken) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		apiMe().then((u) => {
			setUser(u);
			setToken(storedToken);
			setStoredAuth(storedToken, u);
			touchActivity();
		}).catch(() => {
			setToken(null);
			setUser(null);
			clearStoredAuth();
		}).finally(() => setIsLoading(false));
	}, []);
	useEffect(() => {
		if (!token) return;
		return initActivityTracking(() => {
			apiLogout().catch(() => {});
			setToken(null);
			setUser(null);
			clearStoredAuth();
			window.location.href = "/login";
		});
	}, [token]);
	const login = useCallback(async (email, password) => {
		setIsLoading(true);
		try {
			const data = await apiLogin(email, password);
			setStoredAuth(data.access_token, data.user);
			setToken(data.access_token);
			setUser(data.user);
			touchActivity();
			return data.user;
		} finally {
			setIsLoading(false);
		}
	}, []);
	const register = useCallback(async (name, email, password, password_confirmation, role_slug) => {
		setIsLoading(true);
		try {
			const data = await apiRegister(name, email, password, password_confirmation, role_slug);
			setStoredAuth(data.access_token, data.user);
			setToken(data.access_token);
			setUser(data.user);
			touchActivity();
			return data.user;
		} finally {
			setIsLoading(false);
		}
	}, []);
	const logout = useCallback(async () => {
		try {
			await apiLogout();
		} catch {}
		setToken(null);
		setUser(null);
		clearStoredAuth();
	}, []);
	const refreshUser = useCallback(async () => {
		const u = await apiMe();
		setUser(u);
		if (token) setStoredAuth(token, u);
		touchActivity();
	}, [token]);
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value: {
			user,
			token,
			isLoading,
			isAuthenticated: !!token && !!user,
			login,
			register,
			logout,
			refreshUser
		},
		children
	});
}
function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
