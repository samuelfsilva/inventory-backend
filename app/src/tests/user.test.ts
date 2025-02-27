import { afterEach, describe, expect, it } from "vitest";
import { User } from "../entities/user";
import { AppDataSource } from "../server";

describe("User Entity", () => {
  afterEach(async () => {
    await AppDataSource.getRepository(User).clear();
  });

  it("should create a new user", async () => {
    const user = new User();
    user.email = "a@a.com";
    user.status = true;
    user.firstName = "Test User";
    user.lastName = "Create User";
    user.password = "123456";

    const saved = await AppDataSource.manager.save(user);

    expect(saved).toHaveProperty("id");
    expect(saved.status).toBe(true);
    expect(saved.email).toBe("a@a.com");
    expect(saved.firstName).toBe("Test User");
    expect(saved.lastName).toBe("Create User");
    expect(saved.password).toBe("123456");
  });
  it("should update a user", async () => {
    const user = new User();
    user.email = "a@a.com";
    user.status = true;
    user.firstName = "Test User";
    user.lastName = "Create User";
    user.password = "123456";

    const saved = await AppDataSource.manager.save(user);

    await AppDataSource.manager.update(
      User,
      { id: saved.id },
      {
        firstName: "Test Update User",
        lastName: "Update User",
      }
    );

    const select = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id: saved.id })
      .getOne();

    expect(select).toHaveProperty("id");
    expect(select?.status).toBe(true);
    expect(select?.email).toBe("a@a.com");
    expect(select?.firstName).toBe("Test Update User");
    expect(select?.lastName).toBe("Update User");
    expect(select?.password).toBe("123456");
  });
  it("should delete a group", async () => {
    const user = new User();
    user.email = "a@a.com";
    user.status = true;
    user.firstName = "Test User";
    user.lastName = "Create User";
    user.password = "123456";

    const saved = await AppDataSource.manager.save(user);
    const savedId = saved.id;

    await AppDataSource.manager.delete(User, { id: savedId });

    const salect = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id: savedId })
      .getOne();

    expect(salect).toBeNull();
  });
});
