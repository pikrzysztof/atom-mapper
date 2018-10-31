package org.example;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.Socket;
import java.util.Scanner;
import java.io.InputStream;
public class HelloWorld extends HttpServlet
{
@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		// set response headers
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		// create HTML form
		PrintWriter writer = response.getWriter();
		writer.append("<!DOCTYPE html>\r\n")
			  .append("<html>\r\n")
			  .append("<head>\r\n")
			.append("<title>Forminput</title>\r\n")
			.append("</head>\r\n")
			.append("<body>\r\n<script"+
				" src=\"https://ajax.googleapis."+
				"com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>")
			.append("<formaction=\"hello\"method=\"POST\">\r\n")
			.append("Enteryourname:\r\n")
			.append("<input type=\"text\"smiles=\"molecule\"/>\r\n")
			.append("<input type=\"submit\"value=\"Submit\"/>\r\n")
			.append("</form>\r\n")
			.append("</body>\r\n")
			.append("</html>\r\n");
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		String molecule = request.getParameter("smiles");
		Socket sock = new Socket(System.getenv("MAPPER_ADDR"),
					 Integer.parseInt(System.getenv("MAPPER_PORT")));
		sock.setTcpNoDelay(true);
		sock.getOutputStream().write(molecule.getBytes());
		sock.getOutputStream().flush();
		String result = readToEnd(sock.getInputStream());
		response.getWriter().append(result);
	}
	
	public static String readToEnd(InputStream in) throws IOException {
		String result = "";
		byte[] b = new byte[1];
		int n;
		while ((n = in.read(b)) >= 0) {
			result += new String(b);
		}
		return result;
	}
}
