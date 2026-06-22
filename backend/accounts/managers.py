from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")

        if not password:
            raise ValueError("A senha é obrigatória.")

        name = extra_fields.get("name")
        if not name or not name.strip():
            raise ValueError("O nome é obrigatório.")

        email = self.normalize_email(email.strip()).lower()
        extra_fields["name"] = name.strip()

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.full_clean()
        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("O superusuário deve possuir is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("O superusuário deve possuir is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    def get_by_natural_key(self, email):
        normalized_email = self.normalize_email(email.strip()).lower()
        return self.get(email=normalized_email)
