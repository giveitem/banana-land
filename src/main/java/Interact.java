import com.github.javafaker.Faker;
import org.apache.commons.lang3.RandomStringUtils;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.HashSet;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class Interact {
    private static final String INSERT_USERS_SQL = "INSERT INTO user_info" +
            "  (id, password, username, first_name, last_name, email, is_staff, is_course_manager, is_org_manager) " +
            "VALUES " +
            " (?, ?, ?, ?, ?, ?, ?, ?, ?);";


    public static byte[] getSHA(String input) throws NoSuchAlgorithmException
    {
        // Static getInstance method is called with hashing SHA
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        // digest() method called
        // to calculate message digest of an input
        // and return array of byte
        return md.digest(input.getBytes(StandardCharsets.UTF_8));
    }
    public static String toHexString(byte[] hash)
    {
        // Convert byte array into signum representation
        BigInteger number = new BigInteger(1, hash);

        // Convert message digest into hex value
        StringBuilder hexString = new StringBuilder(number.toString(16));

        // Pad with leading zeros
        while (hexString.length() < 64)
        {
            hexString.insert(0, '0');
        }

        return hexString.toString();
    }

    public static void connect() {
        Connection con = null;
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

            insert(con);
        }
        catch (ClassNotFoundException | SQLException  e) {
            System.out.println(e);
        }

    }
    public static void insert(Connection con) {
        HashSet<Integer> set = new HashSet<>();

        User[] userArray = new User[100000];
        Random rand = new Random();
        try {
            for (int i = 0; i < 100000; i++) {
                Faker faker = new Faker();
                String randomString = RandomStringUtils.randomAlphanumeric(10);
                int randomId = rand.nextInt(10000000);
                while (set.contains(randomId)){
                    randomId = rand.nextInt(10000000);
                }
                set.add(randomId);
                userArray[i] = new User(randomId, toHexString(getSHA(randomString)), randomString,
                        faker.name().firstName(), faker.name().lastName(), faker.internet().emailAddress(), rand.nextBoolean(),
                        rand.nextBoolean(), rand.nextBoolean());
            }
        }catch (NoSuchAlgorithmException e) {
            System.out.println("Exception thrown for incorrect algorithm: " + e);
        }

            for (User user : userArray){
                try {
                    TimeUnit.MILLISECONDS.sleep(10);
                    PreparedStatement st = con.prepareStatement(INSERT_USERS_SQL);
                    st.setInt(1, user.getId());
                    st.setString(2, user.getPassword());
                    st.setString(3, user.getUsername());
                    st.setObject(4, user.getFirst_name());
                    st.setObject(5, user.getLast_name());
                    st.setObject(6, user.getEmail());
                    st.setBoolean(7, user.isIs_staff());
                    st.setBoolean(8, user.isIs_course_manager());
                    st.setBoolean(9, user.isIs_org_manager());
                    st.executeUpdate();
                    st.close();
                } catch (SQLException |InterruptedException e) {
                    System.out.println(e);
                }
            }



    }

    public static void main(String[] args) throws SQLException {
        connect();
    }

}
