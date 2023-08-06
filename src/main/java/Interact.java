import org.apache.commons.lang3.RandomStringUtils;

import java.sql.*;

public class Interact {
    public static void main(String[] args) throws SQLException {
        interact();
    }


    public static Connection interact() throws SQLException {

        String results = "";
        Connection con = null;
        Statement readStatement = null;
        ResultSet resultSet = null;
        try {
            Class.forName("org.postgresql.Driver");
            String dbName = System.getenv("RDS_DB_NAME");
            String userName = System.getenv("RDS_USERNAME");
            String password = System.getenv("RDS_PASSWORD");
            String hostname = System.getenv("RDS_HOSTNAME");
            String port = System.getenv("RDS_PORT");
            String jdbcUrl = "jdbc:postgresql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password;
            System.out.println("Getting remote connection with connection string from environment variables.");
            con = DriverManager.getConnection(jdbcUrl);
            System.out.println("Remote connection successful.");

//            return con;
        }
        catch (ClassNotFoundException | SQLException e) {
            System.out.println(e.toString());
        }


        readStatement = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        resultSet = readStatement.executeQuery("SELECT * FROM auth_user;");
        resultSet.first();
        results = resultSet.getString("username");
        System.out.println(results);
        resultSet.close();
        readStatement.close();
        con.close();
        RandomStringUtils randomStringUtils = new RandomStringUtils();
        String randomString = randomStringUtils.randomAlphanumeric(10);
        System.out.println(randomString);
        return null;

    }
}
