from rest_framework.permissions import BasePermission


SAFE_METHODS = ["POST", "HEAD", "OPTIONS"]

READ_SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]


class IsOwnerArticleOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `article.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `article.user.id`.
        return obj.article.user.id == request.user.id
