const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
  	throw new Error("PUBLIC_API_URL is not defined");
}

export default baseUrl