package example;
public class User {
    private int id;
    private String password;
    private String username;
    private String first_name;
    private String last_name;
    private String email;
    private boolean is_staff;
    private boolean is_course_manager;
    private boolean is_org_manager;

    public User(int id, String password, String username, String first_name, String last_name, String email, boolean is_staff, boolean is_course_manager, boolean is_org_manager) {
        this.id = id;
        this.password = password;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.is_staff = is_staff;
        this.is_course_manager = is_course_manager;
        this.is_org_manager = is_org_manager;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isIs_staff() {
        return is_staff;
    }

    public void setIs_staff(boolean is_staff) {
        this.is_staff = is_staff;
    }

    public boolean isIs_course_manager() {
        return is_course_manager;
    }

    public void setIs_course_manager(boolean is_course_manager) {
        this.is_course_manager = is_course_manager;
    }

    public boolean isIs_org_manager() {
        return is_org_manager;
    }

    public void setIs_org_manager(boolean is_org_manager) {
        this.is_org_manager = is_org_manager;
    }

}
