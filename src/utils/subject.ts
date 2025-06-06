export const saveToLocalStorage = (key: string, data: any) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string) => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};