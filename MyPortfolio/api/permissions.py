from rest_framework.permissions import BasePermission


SAFE_METHODS = ["POST", "HEAD", "OPTIONS"]

READ_SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]


class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Permission to only allow authenticated user to can use POST method.
    """

    message = "Authentication is required."

    def has_permission(self, request, view):
        if request.method in READ_SAFE_METHODS:
            return True

        if request.user.is_authenticated:
            return True

        return False


class IsAuthenticatedOrPostOnly(BasePermission):
    """
    Permission to only allow authenticated user to can use POST method.
    """

    message = "Authentication is required."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow POST, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_authenticated:
            return True

        return False


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `user.id`.
        return obj.user.id == request.user.id


class IsOwner(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `user.id`.
        return obj.user.id == request.user.id
